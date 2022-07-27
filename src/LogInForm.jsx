import { Tooltip, TextField } from '@mui/material';
import axios from 'axios'

import { useState } from 'react'

const LogInForm = () => {

    const [usernameText, setUsernameText] = useState("")
    const [usernameErr, setUsernameErr] = useState(false);
    const [username, setUsername] = useState("")
    const [userExists, setUserExists] = useState(false)

    const [passwordText, setPasswordText] = useState("")
    const [passwordErr, setPasswordErr] = useState("")
    const [password, setPassword] = useState("")

    const [somethingWentWrong, setSomethingWentWrong] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false)


    const handleUsernameChange = (newVal) => {
        setUsernameText(newVal)
        if (!UsernameChecker(newVal) && !usernameErr) {
            setUsernameErr(true)
        } else if (UsernameChecker(newVal) && usernameErr) {
            setUsernameErr(false)
        }
    }

    const UsernameChecker = (text) => {
        //between 8 - 30 char start with a letter and only contain letters numbers and _
        const regex = "^[A-Za-z][A-Za-z0-9_]{7,29}$";
        return text.match(regex) !== null
    }

    const handlePasswordChange = (newVal) => {
        setPasswordText(newVal)
        if (!passwordChecker(newVal) && !passwordErr) {
            setPasswordErr(true)
        } else if (passwordChecker(newVal) && passwordErr) {
            setPasswordErr(false)
        }

    }

    const passwordChecker = (text) => {
        //at least 8 charachters, atleast one upper one lower and one number
        const regex = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        return text.match(regex) !== null
    }


    const checkForDuplicateUsernames = () => {
        if (!passwordChecker(passwordText) && !UsernameChecker(usernameText)) {
            setUsername(usernameText)
            setPassword(passwordText)
            axios.get(`https://git.heroku.com/login-app-api-test.git/api/users/${username}`)
                .then(res => {
                    setUserExists(true)
                    setUsernameText("")
                    setUsername("")
                })
                .catch(err => {
                    if (err.msg === "Not Found") {
                        postUserAndPassword()
                    }
                })
        }
    }
    const postUserAndPassword = () => {
        axios.post(`https://git.heroku.com/login-app-api-test.git/api/users/${username}`, { password: password })
            .then(res => {
                // setLoggedIn(true)
                setUsername("")
                setUsernameText("")
                setPassword("")
                setPasswordText("")
            }).catch(err => {
                setUsername("")
                setUsernameText("")
                setPassword("")
                setPasswordText("")
                setSomethingWentWrong(true)
                setTimeout(setSomethingWentWrong(false), 5000)
            })
    }

    return loggedIn ? <div>Logged in</div> : somethingWentWrong ? <div>Oops, something went wrong please contact IT support</div> : (<>
        <form style={{ "justifyContent": "spaceBetween", "display": "flex" }} >
            <div >
                <Tooltip title={"Username must be between 8-30 characters and start with a letter, can include numbers and underscores"}>
                    <TextField
                        error={usernameErr}
                        sx={{ "backgroundColor": "white", "marginTop": "2em" }}
                        required
                        id="outlined-required"
                        label="Username"

                        value={usernameText}
                        onChange={(e) =>
                            handleUsernameChange(e.target.value)}
                    />
                </Tooltip>
                <Tooltip title={"Password must be longer than 8 character and contain at least... one uppercase, one lowercase, one special character and one number"}>
                    <TextField
                        sx={{ "backgroundColor": "white", "marginTop": "2em" }}
                        error={passwordErr}
                        label="Password"
                        type="password"
                        onChange={(e) => handlePasswordChange(e.target.value)}
                    />

                </Tooltip>
                {userExists && <p>username ${username} already exists</p>}
            </div>
        </form>
        <button onClick={checkForDuplicateUsernames()}>Submit</button>
    </>
    )
}

export default LogInForm