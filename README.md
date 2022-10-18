<h1 style="border-bottom: 1px solid rgb(204, 204, 204)"> Chat-App </h1>

<h2 style="border-bottom: 1px solid rgb(204, 204, 204)"> Description </h2>

This is a real-time chat application which provides online communication through not only exchanging messages but also video call between two users.
https://chat-app-0tg7.onrender.com

<h2 style="border-bottom: 1px solid rgb(204, 204, 204)"> Built With </h2>

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)

<h2 style="border-bottom: 1px solid rgb(204, 204, 204)"> Getting Started </h2>

### Installation
* Clone the repo
    ```
    git clone https://github.com/Chaeri-Yoon/chat-app.git
    ```

### Executing program
    # Build client project
    cd src/client
    npm run build

    # Start server
    npm run server

### Join a chat room
* Join a chat room with your own username and your selection of avatar icon.
    <img src="https://i.postimg.cc/656FBS4y/Chat-App-2.jpg" style="border: 1px solid rgb(0, 0, 0)"/>   
<br>
* You can join a chatroom by either selecting from the list of existing chat rooms or creating your own. Once you have had an username and a chatroom to join, the joining button will be activated.
    <img src="https://i.postimg.cc/pVn8SXLZ/Chat-App-4.jpg" style="border: 1px solid rgb(0, 0, 0)"/>   
<br>
* If there is two users in a certain chat room, it means the room is full of capacity and so no more user is allowed to enter until there becomes any seat available.
    <img src="https://i.postimg.cc/pXJ9N9bD/Chat-App-9.jpg" style="border: 1px solid rgb(0, 0, 0)"/>  
<br>
### In a chat room
* **Video call**
    * Once you have accepted its access to your camera and mic, it will show your camera screen. 
    [![Chat-App-5.jpg](https://i.postimg.cc/4dJQzCgc/Chat-App-5.jpg)](https://postimg.cc/kVpSmpDM)
    <br>
    * **Peer video call**
        When there is another member in the same chat room and they have granted access to their media devices, you can communicate through video call.
        <img src="https://i.postimg.cc/26LmCt1s/Chat-App-6.jpg" style="border: 1px solid rgb(0, 0, 0)"/>   
    <br>
    * **Media device access**
        When you click buttons to deactivate either camera or mic, the application no longer accesses that device.
        <img src="https://i.postimg.cc/D0Q9Z3nM/Chat-App-7.jpg" style="border: 1px solid rgb(0, 0, 0)"/>    
    <br>
* **Message chat**
    * When another user enters into the chat room, it will inform you through a message.
    <img src="https://i.postimg.cc/26LmCt1s/Chat-App-6.jpg" style="border: 1px solid rgb(0, 0, 0)"/>
    <br>

    * Users can communicate through messages
    <img src="https://i.postimg.cc/wjBjS0kp/Chat-App-8.jpg" style="border: 1px solid rgb(0, 0, 0)"/>

<h2 style="border-bottom: 1px solid rgb(204, 204, 204)"> Roadmap </h2>

- [ ] Implement a video call function among multiple users.
- [ ] Create a video section each time an user enters into the room.
- [ ] CSS work for the way it shows the list of existing rooms for aesthetic purpose
- [ ] Mobile version