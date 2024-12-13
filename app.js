import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const serverPort = process.env.PORT;

const app = express();
const users = [];
app.use(express.json());

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}`);
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //Find if user exists
    const findUser = users.find((data) => email == data.email);
    if (findUser) {
      /* returns object of this user */ res.send(`${email} already exists`);
    } else {
      // Hash password
      const hashedPasword = await bcrypt.hash(password, 10);
      await users.push({ name, email, password: hashedPasword });
      res.send(`Registered Successfully, ${name}`);
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Find if user exists
    const findUser = users.find((data) => email == data.email);
    if (!findUser) {
      res.send("Wrong email or password");
    } else {
      const passwordMatch = await bcrypt.compare(password, findUser.password);
      if (passwordMatch) {
        /* returns boolean*/ res.send(
          `Hello ${findUser.name}, You're logged in successfully!`
        );
      }
      res.send("Wrong email or password");
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
});
