export default class Services {
  async getUser() {
    const data = await fetch("/general/getClient", {
      method: "get",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const resonse = data.json();
    return resonse;
  }
  getToken() {
    return localStorage.getItem("authToken");
  }
  date(datetimeString) {
    const date = new Date(datetimeString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour format
    };
    return date.toLocaleDateString("en-US", options);
  }
}
