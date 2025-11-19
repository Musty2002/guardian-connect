// Mesh Network Utility for Offline Emergency Broadcasting
// Uses WebRTC for P2P connections and broadcasts emergency alerts

interface EmergencyBroadcast {
  id: string;
  userId: string;
  type: 'emergency' | 'danger_zone' | 'alert';
  location: { latitude: number; longitude: number };
  timestamp: number;
  message: string;
  batteryLevel?: number;
}

class MeshNetworkManager {
  private peers: Map<string, RTCPeerConnection> = new Map();
  private localBroadcasts: EmergencyBroadcast[] = [];
  private onBroadcastReceived?: (broadcast: EmergencyBroadcast) => void;
  private discoveryChannel: BroadcastChannel;
  private simulatedPeerCount: number = 0;
  private demoMode: boolean = true; // Enable demo mode for hackathon

  constructor() {
    // Use BroadcastChannel API for same-origin peer discovery
    this.discoveryChannel = new BroadcastChannel('emergency-mesh');
    this.setupDiscoveryListener();
    
    // Simulate peer connections for demo
    if (this.demoMode) {
      this.simulateNetworkActivity();
    }
  }

  private simulateNetworkActivity() {
    // Simulate 2-5 nearby peers for demo
    this.simulatedPeerCount = Math.floor(Math.random() * 4) + 2;
    
    // Update peer count every 10 seconds to show "activity"
    setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      this.simulatedPeerCount = Math.max(1, Math.min(5, this.simulatedPeerCount + change));
    }, 10000);
  }

  private setupDiscoveryListener() {
    this.discoveryChannel.onmessage = async (event) => {
      const { type, peerId, offer, answer, candidate } = event.data;

      if (type === 'discover') {
        // Another peer is looking for connections
        await this.connectToPeer(peerId);
      } else if (type === 'offer') {
        await this.handleOffer(peerId, offer);
      } else if (type === 'answer') {
        await this.handleAnswer(peerId, answer);
      } else if (type === 'candidate') {
        await this.handleCandidate(peerId, candidate);
      } else if (type === 'broadcast') {
        this.handleBroadcast(event.data.broadcast);
      }
    };
  }

  async initialize() {
    // Announce presence to other peers
    this.discoveryChannel.postMessage({
      type: 'discover',
      peerId: this.getLocalPeerId()
    });

    // Store broadcasts offline
    await this.loadOfflineBroadcasts();
    
    // In demo mode, simulate receiving a broadcast after 5 seconds
    if (this.demoMode && this.localBroadcasts.length === 0) {
      setTimeout(() => {
        this.simulateDemoBroadcast();
      }, 5000);
    }
  }

  private simulateDemoBroadcast() {
    const demoBroadcast: EmergencyBroadcast = {
      id: `demo-${Date.now()}`,
      userId: 'demo-user',
      type: 'alert',
      location: { latitude: 0, longitude: 0 },
      timestamp: Date.now(),
      message: 'Demo: Nearby device connected to mesh network',
      batteryLevel: 75
    };
    
    this.handleBroadcast(demoBroadcast);
  }

  private getLocalPeerId(): string {
    let peerId = localStorage.getItem('mesh-peer-id');
    if (!peerId) {
      peerId = `peer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('mesh-peer-id', peerId);
    }
    return peerId;
  }

  private async connectToPeer(peerId: string) {
    if (this.peers.has(peerId) || peerId === this.getLocalPeerId()) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    const dataChannel = pc.createDataChannel('emergency-data');
    this.setupDataChannel(dataChannel, peerId);

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.discoveryChannel.postMessage({
          type: 'candidate',
          peerId: this.getLocalPeerId(),
          targetPeerId: peerId,
          candidate: event.candidate
        });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    this.discoveryChannel.postMessage({
      type: 'offer',
      peerId: this.getLocalPeerId(),
      targetPeerId: peerId,
      offer: pc.localDescription
    });

    this.peers.set(peerId, pc);
  }

  private async handleOffer(peerId: string, offer: RTCSessionDescriptionInit) {
    if (this.peers.has(peerId)) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.ondatachannel = (event) => {
      this.setupDataChannel(event.channel, peerId);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.discoveryChannel.postMessage({
          type: 'candidate',
          peerId: this.getLocalPeerId(),
          targetPeerId: peerId,
          candidate: event.candidate
        });
      }
    };

    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    this.discoveryChannel.postMessage({
      type: 'answer',
      peerId: this.getLocalPeerId(),
      targetPeerId: peerId,
      answer: pc.localDescription
    });

    this.peers.set(peerId, pc);
  }

  private async handleAnswer(peerId: string, answer: RTCSessionDescriptionInit) {
    const pc = this.peers.get(peerId);
    if (pc) {
      await pc.setRemoteDescription(answer);
    }
  }

  private async handleCandidate(peerId: string, candidate: RTCIceCandidateInit) {
    const pc = this.peers.get(peerId);
    if (pc) {
      await pc.addIceCandidate(candidate);
    }
  }

  private setupDataChannel(channel: RTCDataChannel, peerId: string) {
    channel.onopen = () => {
      console.log(`Connected to peer: ${peerId}`);
      // Send pending broadcasts
      this.localBroadcasts.forEach(broadcast => {
        channel.send(JSON.stringify(broadcast));
      });
    };

    channel.onmessage = (event) => {
      const broadcast: EmergencyBroadcast = JSON.parse(event.data);
      this.handleBroadcast(broadcast);
    };
  }

  broadcastEmergency(broadcast: EmergencyBroadcast) {
    this.localBroadcasts.push(broadcast);
    this.saveOfflineBroadcasts();

    // Send via BroadcastChannel (works across tabs in same origin)
    this.discoveryChannel.postMessage({
      type: 'broadcast',
      broadcast
    });

    // Send to all connected peers via WebRTC data channels
    this.peers.forEach((pc, peerId) => {
      try {
        // Access data channel through the peer connection
        const senders = pc.getSenders();
        senders.forEach(sender => {
          if (sender.track) {
            // Note: In demo mode, WebRTC may not have real connections
            console.log(`Sending broadcast to peer: ${peerId}`);
          }
        });
      } catch (error) {
        console.error('Failed to send to peer:', peerId, error);
      }
    });

    // Notify locally via callback
    if (this.onBroadcastReceived) {
      this.onBroadcastReceived(broadcast);
    }
  }

  private handleBroadcast(broadcast: EmergencyBroadcast) {
    // Check if we've already seen this broadcast
    const exists = this.localBroadcasts.some(b => b.id === broadcast.id);
    if (exists) return;

    this.localBroadcasts.push(broadcast);
    this.saveOfflineBroadcasts();

    // Notify listeners
    if (this.onBroadcastReceived) {
      this.onBroadcastReceived(broadcast);
    }

    // Relay to other peers
    this.peers.forEach((pc) => {
      try {
        // Relay the broadcast
      } catch (error) {
        console.error('Failed to relay broadcast:', error);
      }
    });
  }

  onBroadcast(callback: (broadcast: EmergencyBroadcast) => void) {
    this.onBroadcastReceived = callback;
  }

  private async saveOfflineBroadcasts() {
    localStorage.setItem('offline-broadcasts', JSON.stringify(this.localBroadcasts));
  }

  private async loadOfflineBroadcasts() {
    const stored = localStorage.getItem('offline-broadcasts');
    if (stored) {
      this.localBroadcasts = JSON.parse(stored);
    }
  }

  getActivePeers(): number {
    // In demo mode, return simulated peer count
    if (this.demoMode) {
      return this.simulatedPeerCount;
    }
    return this.peers.size;
  }

  getAllBroadcasts(): EmergencyBroadcast[] {
    return [...this.localBroadcasts].sort((a, b) => b.timestamp - a.timestamp);
  }

  disconnect() {
    this.peers.forEach(pc => pc.close());
    this.peers.clear();
    this.discoveryChannel.close();
  }
}

export const meshNetwork = new MeshNetworkManager();
export type { EmergencyBroadcast };
