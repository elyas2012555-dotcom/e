
import React, { useState, useEffect, useRef } from 'react';
import { AuctionStatus, AuctionState, Bidder, ConnectionStatus } from './types';
import Dashboard from './components/Dashboard';
import AuctionCard from './components/AuctionCard';
import AuthOverlay from './components/AuthOverlay';

const App: React.FC = () => {
  const isOverlayMode = window.location.search.includes('mode=overlay');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  
  const [auction, setAuction] = useState<AuctionState>({
    timeLeft: 120,
    dalyTimeLeft: 30,
    initialDalyTime: 30,
    status: AuctionStatus.OFFLINE,
    bidders: [],
    totalParticipants: 0,
    snipeDelay: 20,
    minBid: 1,
    connectionStatus: ConnectionStatus.DISCONNECTED,
    winner: null,
  });

  const [earnings, setEarnings] = useState({ coins: 0, usd: 0 });

  // مزامنة الحالة عبر LocalStorage للنافذة المستقلة (OBS)
  useEffect(() => {
    if (isOverlayMode) {
      const handleStorage = () => {
        const saved = localStorage.getItem('auction_state');
        if (saved) {
          try {
            setAuction(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse storage', e);
          }
        }
      };
      window.addEventListener('storage', handleStorage);
      handleStorage(); // القراءة الأولية
      return () => window.removeEventListener('storage', handleStorage);
    }
  }, [isOverlayMode]);

  useEffect(() => {
    if (!isOverlayMode && isAuthenticated) {
      localStorage.setItem('auction_state', JSON.stringify(auction));
    }
  }, [auction, isOverlayMode, isAuthenticated]);

  const handleIncomingBid = (data: { username: string, avatar: string, coins: number }) => {
    if (auction.status === AuctionStatus.OFFLINE || auction.status === AuctionStatus.FINISHED) return;

    setAuction(prev => {
      if (data.coins < prev.minBid) return prev; 

      let newBidders = [...prev.bidders];
      const index = newBidders.findIndex(b => b.username === data.username);

      if (index !== -1) {
        newBidders[index].totalCoins += data.coins;
      } else {
        newBidders.push({
          id: Math.random().toString(),
          username: data.username,
          avatar: data.avatar,
          totalCoins: data.coins
        });
      }

      newBidders.sort((a, b) => b.totalCoins - a.totalCoins);

      let newTime = prev.timeLeft;
      if (prev.timeLeft <= 10 && prev.timeLeft > 0) {
        newTime += prev.snipeDelay;
      }

      return {
        ...