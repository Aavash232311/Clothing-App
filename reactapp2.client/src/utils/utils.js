export default class Services {
    async getUser() {
        const data = await fetch("/general/getClient", {
            method: "get",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`
            },
        });
        const resonse = data.json();
        return resonse;
    }
}