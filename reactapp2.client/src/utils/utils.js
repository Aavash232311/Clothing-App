export default class Services {
  // most explicit level of comopoene and in the case of page load refresh that token
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
  getRefreshToken() {
    return localStorage.getItem("refreshToken");
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
  async refreshToken() {
    const refreshUrl = "/refresh/";

    try {
      const response = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({
          refreshToken: this.getRefreshToken(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      return await response.json();
    } catch (error) {
      console.error("Error refreshing token: ", error.message);
      throw error;
    }
  }
}
