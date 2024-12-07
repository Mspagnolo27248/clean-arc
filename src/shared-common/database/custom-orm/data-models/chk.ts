class UserDTO {
    constructor(public id: string, public name: string, public email: string) {}
  }
  

  const data = new UserDTO("1",'Mike','mspag@emai.com')

  console.log(JSON.stringify(data))