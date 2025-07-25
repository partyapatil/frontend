export interface Ilogin{
    name:string,
    password:string
}

export interface Chat {
    _id: string;
    chatName: string;
    isGroupChat: boolean;
    users: {
      _id: string;
      name: string;
      email: string;
      pic: string;
      createdAt: string;
      updatedAt: string;
    }[];
    groupAdmin: {
      _id: string;
      name: string;
      email: string;
      pic: string;
      createdAt: string;
      updatedAt: string;
    };
    createdAt: string;
    updatedAt: string;
    latestMessage?: {
      _id: string;
      sender: {
        _id: string;
        name: string;
        email: string;
        pic: string;
      };
      content: string;
      chat: string;
      createdAt: string;
      updatedAt: string;
    };
  }
  