import express from 'express';
import "dotenv/config";
import { genSaltSync, hashSync } from 'bcrypt';
import { StreamChat } from 'stream-chat';

const { PORT, STREAM_API_KEY, STREAM_API_SECRET } = process.env;

const client = StreamChat.getInstance(STREAM_API_KEY!, STREAM_API_SECRET!);

const app = express();
app.use(express.json())

const salt = genSaltSync(10)

interface User {
    id: string;
    email: string;
    hashed_passsword: string;
}

const USERS: User[] = []

app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" })
    }

    const userExists = USERS.find(user => user.email === email);

    if (userExists) {
        throw new Error("User already exists")
    }
    try {

        const hashed_passsword = hashSync(password, salt);
        const id = Math.random().toString(36).slice(2);
        const newUser = {
            id,
            email,
            hashed_passsword
        }

        USERS.push(newUser);

        await client.upsertUser({
            id,
            name: email,
            email,
        } as any);


        const token = client.createToken(id);

        return res.status(201).json({token, user: {id, email}})


    } catch (error) {
        res.status(500).json({ message: "User already exists" })
    }

})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = USERS.find(user => user.email === email);
    const hashed_password = hashSync(password, salt);

    if(!user || user.hashed_passsword !== hashed_password) {
        return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = client.createToken(user.id);

    return res.status(200).json({token, user: {id: user.id, email: user.email}})
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})