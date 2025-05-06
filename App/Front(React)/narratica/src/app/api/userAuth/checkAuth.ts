export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("access");
    return token !== null;
};
