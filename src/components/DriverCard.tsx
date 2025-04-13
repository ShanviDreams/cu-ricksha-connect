
import { Phone, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DriverCardProps {
  id: string;
  name: string;
  mobileNumber: string;
  isAvailable: boolean;
}

const DriverCard = ({ id, name, mobileNumber, isAvailable }: DriverCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${mobileNumber}`;
  };

  const handleMessage = () => {
    window.location.href = `sms:${mobileNumber}`;
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className={`p-4 ${isAvailable ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{name}</CardTitle>
          <span className="text-sm font-bold px-2 py-1 rounded bg-white/20">
            {isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <CardDescription className="text-white/90">Driver ID: {id}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{mobileNumber}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button 
            onClick={handleCall} 
            variant="outline" 
            className="flex items-center justify-center"
            disabled={!isAvailable}
          >
            <Phone className="mr-1" size={16} /> Call
          </Button>
          <Button 
            onClick={handleMessage} 
            variant="outline" 
            className="flex items-center justify-center"
            disabled={!isAvailable}
          >
            <MessageSquare className="mr-1" size={16} /> Message
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverCard;
