
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Booking {
  _id: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message?: string;
  employee: {
    name: string;
    employeeId: string;
  };
  assignedDriver: string | null;
  driverResponses: Array<{
    driver: string;
    response: 'green' | 'orange';
    respondedAt: string;
  }>;
  createdAt: string;
}

const API_URL = 'https://cu-e-ricksha-backend.onrender.com/api';

const BookingsList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/drivers/bookings`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    
    // Refresh bookings every minute
    const interval = setInterval(fetchBookings, 60000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const handleBookingResponse = async (bookingId: string, response: 'green' | 'orange') => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/drivers/respond`, 
        { bookingId, response },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update the booking in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { 
                ...booking, 
                driverResponses: [
                  ...booking.driverResponses.filter(dr => dr.driver !== user?.id),
                  { driver: user?.id || '', response, respondedAt: new Date().toISOString() }
                ],
                ...(response === 'green' && booking.status === 'pending' ? { status: 'accepted', assignedDriver: user?.id || null } : {})
              } 
            : booking
        )
      );
      
      toast.success(`You have responded ${response === 'green' ? 'Coming' : 'Not Coming'}`);
    } catch (error) {
      console.error("Error responding to booking:", error);
      toast.error("Failed to respond to booking");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-gray-400">
        No bookings available at the moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Bookings</h2>
        <Button variant="outline" onClick={fetchBookings} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher</TableHead>
              <TableHead>Pickup</TableHead>
              <TableHead>Dropoff</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => {
              // Check if current driver has already responded
              const driverResponse = booking.driverResponses.find(
                dr => dr.driver === user?.id
              );
              const isAssigned = booking.assignedDriver === user?.id;
              
              return (
                <TableRow key={booking._id}>
                  <TableCell>{booking.employee.name}</TableCell>
                  <TableCell>{booking.pickupLocation}</TableCell>
                  <TableCell>{booking.dropoffLocation}</TableCell>
                  <TableCell>{format(new Date(booking.pickupTime), "MMM d, h:mm a")}</TableCell>
                  <TableCell>{booking.message || "No message"}</TableCell>
                  <TableCell>
                    {isAssigned ? (
                      <span className="text-green-500 flex items-center">
                        <CheckCircle size={16} className="mr-1" />
                        Assigned to you
                      </span>
                    ) : booking.status === 'pending' ? (
                      <span className="text-yellow-500">Pending</span>
                    ) : (
                      <span className="text-gray-500">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {booking.status === 'pending' && !driverResponse ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleBookingResponse(booking._id, 'green')}
                          variant="outline"
                          size="sm"
                          className="bg-green-100 hover:bg-green-200"
                        >
                          <CheckCircle size={16} className="mr-1 text-green-500" />
                          Coming
                        </Button>
                        <Button
                          onClick={() => handleBookingResponse(booking._id, 'orange')}
                          variant="outline"
                          size="sm" 
                          className="bg-orange-100 hover:bg-orange-200"
                        >
                          <XCircle size={16} className="mr-1 text-orange-500" />
                          Not Coming
                        </Button>
                      </div>
                    ) : driverResponse ? (
                      <span className={driverResponse.response === 'green' ? 
                        "text-green-500 flex items-center" : "text-orange-500 flex items-center"}
                      >
                        {driverResponse.response === 'green' ? (
                          <>
                            <CheckCircle size={16} className="mr-1" />
                            You're Coming
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="mr-1" />
                            Not Coming
                          </>
                        )}
                      </span>
                    ) : (
                      <span className="text-gray-500">No action needed</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default BookingsList;
