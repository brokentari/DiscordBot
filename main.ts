import * as fs from "fs";
import * as Discord from "discord.js";
const auth = JSON.parse(fs.readFileSync("./auth.json").toString())

interface Person {
  classes: NEUClass[]
  id: string;
}

interface NEUClass {
  // CS or ...
  type: string,
  classNumber: number,
  section: number
}

let bot = new Discord.Client()

let people: Person[] = [];
bot.on("ready", function(evt: any) {
});

bot.on("messageDelete", (message) => {
  if(channel) {
    let messageTo = "Message: " + message.content + "\n" + 'User that deleted the message: <@' + message.author.id + ">\n" + "Deleted at: " + message.createdTimestamp
    channel.send(messageTo);
  }
})
let obj: any = {}
let channel: any
let channelAssigned = false;
bot.on("message", async message => {

  if(message.content[0]=="+") {
    
    let args = message.content.substring(1).split(' ');
    let cmd = args[0];
    let rest = message.content.substring(2 + cmd.length);
    console.log("check 1");
    if (cmd == "Shut") {
      if(message.author.username=="Winnie" || message.author.username=="Ryan") {
        if(!message.author.bot)
        message.channel.send("Shut the FUCK door to my anus because I like to suck lollipops in your nose");
      }
    }

    if (cmd === "listemojis") {
      const emojiList = message.guild.emojis.map(e=>e.toString()).join(" ");
      message.channel.send(emojiList);
    }
    
    if(cmd=="peepoBirthday") {
      message.channel.send(`${bot.emojis.get("384214644258242560")}`)
    }
    if(cmd == "channel" && channelAssigned == false) {
      console.log("set channel");
      channelAssigned = true;
      channel = message.channel;
    }

    if(cmd == "sob") {
      message.channel.send(`${bot.emojis.find("name", "FeelsSobMan")}`)
    }
    if(cmd == "gamble") {

      if(message.author.username=="Ryan" || message.author.username=="jreiss1923") {
        message.channel.send("You win!")
        if(obj[message.author.username])
        obj[message.author.username] = obj[message.author.username] + 1
        else
        obj[message.author.username] = 1
      }
      else {
        message.channel.send("You lose!")
      }
    }

    if(cmd == "score") {
      message.channel.send(obj[message.author.username])
    }

    if(cmd == "search") {
      message.channel.send("https://www.google.com/search?q=" + rest)
    }

    if(cmd == "addClasses") {
      console.log("check2")
      let res = parse(rest, message.author)
      message.channel.send("You are taking: " + JSON.stringify(res))
    }

  }
});

function parse(classList: string, author: Discord.User) {
  let authorID = author.id; //use this to fetch
  console.log("check3")
  let returnCheck = checkIfExists(authorID);
  console.log("check 5..." + JSON.stringify(returnCheck))
  let newPerson: Person
  if(returnCheck === undefined) {
    newPerson = {
      classes: [],
      id: ""
    }
  }
  else  {
    newPerson = returnCheck
  }
  newPerson.id = authorID
  // begin parsing... classes need to be of format (*area of study**number* *section*,)**
  let splitClassList = classList.split(",");
  console.log(`class list: ${splitClassList}`)
  for(let sClass of splitClassList) {
    let siClass = sClass.split(" ");
    let newClass: NEUClass = {
      type: "",
      classNumber: 0,
      section: 0
    }
    newClass.section = parseInt(siClass[1]);
    let index: number = 0;
    while(index < siClass[0].length) {
      let siClassChar = siClass[0][index]
      console.log("checking parsing: " + JSON.stringify(siClass[0]) + ", on current char: " + siClassChar)
      let charInt: number = parseInt(siClassChar)

      if(!isNaN(charInt)) {
        console.log("stopping on int: " + charInt)
        let classNumber = siClass[0].substring(index)
        newClass.classNumber = parseInt(classNumber)
        newClass.type = siClass[0].substring(0, index)
        break
      }
      index++
    }
    newPerson.classes.push(newClass)
  }

  if(returnCheck === undefined) {
    people.push(newPerson)
  }
  console.log("result: " + JSON.stringify(newPerson))
  return newPerson
}

function checkIfExists(authorID: string): Person | undefined {
  console.log("check4")
  for (let person of people) {
    if(person.id === authorID) {
      return person
    }
  }
  console.log("about to return from checkifexists")
  return undefined;
}

bot.login(auth.token);