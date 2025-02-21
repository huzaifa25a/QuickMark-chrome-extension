import { GoogleLogin } from "@react-oauth/google";

const client ='189203013528-gdcl0osud1987fipj4hr5aduhcrek1j6.apps.googleusercontent.com'

function Logout(){
    const onSuccess = (res) => {
        console.log("Logged out successfully ", res);
    } 

    return (
        <div id="signInButton">
            <GoogleLogout 
                clientId={clientId}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;