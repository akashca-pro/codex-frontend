import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateSessionMutation } from '@/apis/collab/user'; // Ensure this path points to your RTK mutation
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCollabSessionActions } from '@/hooks/useDispatch'; // 👈 Import Redux actions hook

interface CollabDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollabDialog: React.FC<CollabDialogProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('start');
  const [joinToken, setJoinToken] = useState('');
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const navigate = useNavigate();
  const { initSession } = useCollabSessionActions(); // 👈 Get Redux action dispatcher

  const handleStart = async () => {
    const toastId = toast.loading('Starting new session...');
    try {
      const result = await createSession(null).unwrap();

      if (result.success && result.data?.inviteToken) {
        const token = result.data.inviteToken;
        toast.success('Session created! Redirecting...', { id: toastId, duration: 2000 });

        // ✨ Dispatch to Redux BEFORE navigating
        console.log("Dispatching initSession with token:", token);
        initSession({ inviteToken: token });

        // Navigate with token still in URL (optional but good for first load/sharing)
        navigate(`/user/collab?token=${token}`);
        onClose(); // Close dialog on success
      } else {
        throw new Error(result.message || 'Failed to create session');
      }
    } catch (error: any) {
      console.error('Failed to start session:', error);
      const message = error?.data?.message || error?.data?.errorMessage || error.message || 'Could not start session.';
      toast.error(message, { id: toastId });
    }
  };

  const handleJoin = () => {
    const tokenToJoin = joinToken.trim();
    if (!tokenToJoin) {
      toast.error('Please enter an invite token.');
      return;
    }
    if (tokenToJoin.length < 10) { // Basic validation
       toast.error('Invalid token format.');
       return;
    }

    // ✨ Dispatch to Redux BEFORE navigating
    console.log("Dispatching initSession with token:", tokenToJoin);
    initSession({ inviteToken: tokenToJoin });

    navigate(`/user/collab?token=${tokenToJoin}`); // Navigate with token
    onClose(); // Close dialog on navigation
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Collaborate on Code</DialogTitle>
        </DialogHeader>
        <Tabs value={tab} onValueChange={setTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="start">Start New</TabsTrigger>
            <TabsTrigger value="join">Join Existing</TabsTrigger>
          </TabsList>
          {/* Start New Tab */}
          <TabsContent value="start" className="space-y-4 pt-4">
            <p className="text-sm text-muted-foreground">
              Create a new real-time collaboration session. Others can join using the invite token.
            </p>
            <DialogFooter>
              <Button onClick={handleStart} disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Starting...' : 'Start Session'}
              </Button>
            </DialogFooter>
          </TabsContent>
          {/* Join Existing Tab */}
          <TabsContent value="join" className="space-y-4 pt-4">
             <label htmlFor="inviteToken" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 sr-only">
               Invite Token
             </label>
            <Input
              id="inviteToken"
              placeholder="Paste invite token here"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              aria-label="Invite Token"
            />
            <DialogFooter>
               <Button onClick={handleJoin} disabled={!joinToken.trim()} className="w-full sm:w-auto">
                Join Session
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CollabDialog;