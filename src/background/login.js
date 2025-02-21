import { GoogleLogin } from "@react-oauth/google";

const client ='189203013528-gdcl0osud1987fipj4hr5aduhcrek1j6.apps.googleusercontent.com'

function Login(){
    const onSuccess = (res) => {
        console.log("Login Sucess! Current user: ", res.profileObj);
    }

    const onFailure = (res) => {
        console.log("Login Failed!: ", res);
    } 

    return (
        <div id="signInButton">
            <GoogleLogin
                clientId = {client}
                onSuccess = {onSuccess}
                onFailure = {onFailure}
                cookiePolicy = {'single_host_origin'}
                isSignedIn = {true}
            />
        </div>
    )
}

export default Login;