## WebRTC Connection Logic

The diagram below covers my understanding of the connection flow between the Godot clients and this signaling server.

Some notes:
- The peer who sends the offer is not determined by which user starts the room. It's currently arbitrarily done based on comparing numeric ID values (whichever player ID is higher, creates the offer).

```mermaid
sequenceDiagram

    participant UIA as UI (A)
    participant WRTCA as WebRTC Service (A)
    participant SS as Signaling Server
    participant WRTCB as WebRTC Service (B)
    participant UIB as UI (B)

    WRTCA->>SS: Connects to server
    WRTCA->>WRTCA: Creates RTC mesh with Player A ID

    WRTCB->>SS: Connects to server
    WRTCB->>WRTCB: Creates RTC mesh with Player B ID

    UIA->>WRTCA: User clicks create room
    WRTCA->>SS: Sends message to create room

    SS->>SS: Creates room and adds player
    SS-->>WRTCA: Responds with room code

    WRTCA->>UIA: Displays room code to user

    UIB->>WRTCB: User enters room code and clicks join
    WRTCB->>SS: Sends message to add user to room with room code

    SS->>SS: Adds player to room
    SS-->>WRTCA: Notifies Player B joined room
    SS-->>WRTCB: Notifies Player A joined room

    WRTCA->>WRTCA: Initializes WebRTC peer connection
    WRTCA->>WRTCA: Adds peer with Player B ID to RTC mesh

    WRTCB->>WRTCB: Initializes WebRTC peer connection
    WRTCB->>WRTCB: Adds peer with Player A ID to RTC mesh

    WRTCB->>WRTCB: Creates SDP offer for new peer
    WRTCB->>WRTCB: Sets local SDP description ICE and connection details
    WRTCB->>WRTCB: Gathers ICE candidates

    WRTCB->>SS: Sends SDP offer with local description
    SS->>WRTCA: Forwards Player B SDP offer

    WRTCA->>WRTCA: Sets remote description with Player B's connection info
    WRTCA->>WRTCA: Creates SDP answer
    WRTCA->>WRTCA: Sets local SDP description ICE and connection details
    WRTCA->>WRTCA: Gathers ICE candidates
    WRTCA->>SS: Sends SDP answer with local description
    SS->>WRTCB: Forwards Player A SDP answer
    WRTCB->>WRTCB: Sets remote description with Player A's info

    WRTCB->>WRTCB: Add received ICE candidates to Player A peer
    WRTCA->>WRTCA: Add received ICE candidates to Player B peer

    Note over WRTCA,WRTCB: ICE connectivity checks succeed and peer connection enters Connected state
```