
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { messageAPI } from '@/services/api';
import { toast } from 'sonner';

interface DriverCardProps {
  id: string;
  name: string;
  mobileNumber: string;
  isAvailable: boolean;
}

const DriverCard: React.FC<DriverCardProps> = ({ id, name, mobileNumber, isAvailable }) => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (message.length > 100) {
      toast.error('Message cannot exceed 100 characters');
      return;
    }

    try {
      setIsSending(true);
      await messageAPI.sendMessage(id, message);
      toast.success(`Message sent to ${name}`);
      setMessage('');
      setMessageOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                isAvailable ? 'bg-green-500' : 'bg-gray-400'
              }`}
            ></span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isAvailable ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Phone size={16} />
          <span>{mobileNumber}</span>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-800 flex justify-between">
        <a href={`tel:${mobileNumber}`}>
          <Button variant="outline" className="flex items-center gap-2">
            <Phone size={16} />
            Call
          </Button>
        </a>
        
        <Dialog open={messageOpen} onOpenChange={setMessageOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex items-center gap-2">
              Message
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Message to {name}</DialogTitle>
              <DialogDescription>
                Send a quick message to the driver (100 characters max).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter pickup location and time..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                  className="resize-none"
                  rows={3}
                />
                <div className="text-right text-sm text-gray-500">
                  {message.length}/100
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default DriverCard;
