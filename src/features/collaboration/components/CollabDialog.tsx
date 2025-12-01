import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateSessionMutation } from '@/apis/collab/user'; 
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useCollabSessionActions } from '@/hooks/useDispatch';

interface CollabDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollabDialog: React.FC<CollabDialogProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState('start');
  const [joinLink, setJoinLink] = useState('');
  const [createSession, { isLoading }] = useCreateSessionMutation();
  const navigate = useNavigate();
  const { initSession, joinSession } = useCollabSessionActions(); 

  const handleStart = async () => {
    const toastId = toast.loading('Starting new session...');
    try {
      const result = await createSession(null).unwrap();

      if (result.success && result.data?.inviteToken) {
        const token = result.data.inviteToken;
        toast.success('Session created! Redirecting...', { 
          id: toastId, 
          duration: 1000, 
          className : 'success-toast' 
        });
        console.log("Dispatching initSession with token:", token);
        initSession({ inviteToken : token })
        navigate(`/user/collab?token=${token}`);
        onClose(); 
      } else {
        throw new Error(result.message || 'Failed to create session');
      }
    } catch (error: any) {
      if(error.status === 409){
        console.log(error);
        toast.info('Session already exist!',{id : toastId});
        navigate(`/user/collab?token=${error.data.data}`);
        onClose(); 
        return;
      }
      console.error('Failed to start session:', error);
      const message = error?.data?.message || error?.data?.errorMessage || error.message || 'Could not start session.';
      toast.error(message, { id: toastId , className : 'error-toast'});
    }
  };

  const handleJoin = () => {
    const LinkToJoin = joinLink.trim();
    if (!LinkToJoin) {
      toast.error('Please enter an invite link.');
      return;
    }
    if (LinkToJoin.length < 10) { // Basic validation
       toast.error('Invalid link.');
       return;
    }

    console.log("Dispatching initSession with token:", LinkToJoin);
    joinSession({ inviteToken : LinkToJoin });

    const relativePath = new URL(LinkToJoin).pathname + new URL(LinkToJoin).search;
    navigate(relativePath, { replace: true });
    onClose(); 
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
            <Input
              id="inviteToken"
              placeholder="Paste invite Link here"
              value={joinLink}
              onChange={(e) => setJoinLink(e.target.value)}
              aria-label="Invite Link"
            />
            <DialogFooter>
               <Button onClick={handleJoin} disabled={!joinLink.trim()} className="w-full sm:w-auto">
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