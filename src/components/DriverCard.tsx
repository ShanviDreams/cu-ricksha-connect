
import { useState } from 'react';
import { Phone, MessageSquare, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { messageAPI } from '@/services/api';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface DriverCardProps {
  id: string;
  name: string;
  mobileNumber: string;
  isAvailable: boolean;
}

const DriverCard = ({ id, name, mobileNumber, isAvailable }: DriverCardProps) => {
  const [message, setMessage] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${mobileNumber}`;
  };

  const handleMessage = () => {
    setIsDialogOpen(true);
  };

  const sendMessage = async () => {
    if (!message.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    if (message.length > 100) {
      toast.error('Message cannot exceed 100 characters');
      return;
    }

    try {
      setIsSending(true);
      await messageAPI.sendMessage(id, message);
      setMessage('');
      setIsDialogOpen(false);
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className={`p-4 ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{name}</CardTitle>
          <Badge variant={isAvailable ? "success" : "secondary"} className="text-sm font-bold">
            {isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
        <CardDescription className="text-white/90">Driver ID: {id}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{mobileNumber}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button 
            onClick={handleCall} 
            variant="outline" 
            className="flex items-center justify-center"
          >
            <Phone className="mr-1" size={16} /> Call
          </Button>
          <Button 
            onClick={handleMessage} 
            variant="outline" 
            className="flex items-center justify-center"
          >
            <MessageSquare className="mr-1" size={16} /> Message
          </Button>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {name}</DialogTitle>
            <DialogDescription>
              Send a quick message (max 100 characters)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter pickup location or other details..."
              className="min-h-[100px]"
              maxLength={100}
            />
            <div className="text-right text-sm text-muted-foreground">
              {message.length}/100 characters
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={sendMessage} 
              disabled={isSending || message.length === 0 || message.length > 100}
            >
              {isSending ? "Sending..." : "Send"} <Send size={16} className="ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default DriverCard;
