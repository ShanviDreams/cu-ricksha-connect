
import { useEffect, useState } from "react";
import { messageAPI } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { format } from "date-fns";

interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  status: string;
  timestamp: string;
}

const MessagesList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageAPI.getMessages();
      // Filter messages relevant to the current user
      const userMessages = data.filter(
        (msg: Message) => msg.to === user?.id || msg.from === user?.id
      );
      setMessages(userMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Refresh messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleMessageResponse = async (messageId: string, status: 'accepted' | 'rejected') => {
    try {
      await messageAPI.updateMessageStatus(messageId, status);
      // Update local state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId ? { ...msg, status } : msg
        )
      );
      
      toast.success(`You have ${status === 'accepted' ? 'accepted' : 'declined'} the request`);
    } catch (error) {
      console.error("Error updating message status:", error);
      toast.error("Failed to update response");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No messages to display.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Messages</h2>
        <Button variant="outline" onClick={fetchMessages}>Refresh</Button>
      </div>
      
      {messages.map((message) => (
        <Card key={message.id} className="overflow-hidden">
          <CardHeader className="p-4 bg-secondary text-secondary-foreground">
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">
                {message.from === user?.id ? "Sent" : "Received"}
              </CardTitle>
              <span className="text-xs">
                {format(new Date(message.timestamp), "MMM d, h:mm a")}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <p className="mb-4">{message.text}</p>
            
            {message.status === 'pending' && message.to === user?.id && (
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={() => handleMessageResponse(message.id, 'accepted')}
                  variant="outline"
                  className="bg-green-100 hover:bg-green-200"
                >
                  <CheckCircle size={16} className="mr-2 text-green-500" />
                  Coming
                </Button>
                <Button
                  onClick={() => handleMessageResponse(message.id, 'rejected')}
                  variant="outline"
                  className="bg-orange-100 hover:bg-orange-200"
                >
                  <XCircle size={16} className="mr-2 text-orange-500" />
                  Not Coming
                </Button>
              </div>
            )}
            
            {message.status === 'accepted' && (
              <div className="flex justify-end">
                <span className="text-green-500 flex items-center">
                  <CheckCircle size={16} className="mr-1" />
                  Accepted
                </span>
              </div>
            )}
            
            {message.status === 'rejected' && (
              <div className="flex justify-end">
                <span className="text-orange-500 flex items-center">
                  <XCircle size={16} className="mr-1" />
                  Declined
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MessagesList;
