const DEFAULT_STATE = {
  Username: "",
  Email: "",
  FirstName: "",
  LastName: ""
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export { DEFAULT_STATE };
