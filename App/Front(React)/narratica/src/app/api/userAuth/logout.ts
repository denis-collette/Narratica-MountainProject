export const logoutUser = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
};
