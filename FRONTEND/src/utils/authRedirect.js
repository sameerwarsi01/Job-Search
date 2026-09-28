export const handleSmartRedirect = (navigate) => {
    const token = 
    localStorage.getItem("token") || 
    localStorage.getItem("userToken") ||
    JSON.parse(localStorage.getItem("user") || "{}")?.token;

    if(token) {
        navigate("/dashboard");
    } else{
        navigate("signup");
    }
};