import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { EditableField } from '../ui/editable-field';

interface PostsTrackerProps {
  reel: { completed: boolean; link: string };
  story: { completed: boolean; link: string };
  onUpdate: (data: { 
    reel: { completed: boolean; link: string };
    story: { completed: boolean; link: string };
  }) => void;
}

export const PostsTracker = ({ reel, story, onUpdate }: PostsTrackerProps) => {
  const handleReelToggle = (checked: boolean) => {
    const updatedReel = { completed: checked, link: reel.link };
    onUpdate({ reel: updatedReel, story });
  };

  const handleStoryToggle = (checked: boolean) => {
    const updatedStory = { completed: checked, link: story.link };
    onUpdate({ reel, story: updatedStory });
  };

  const handleReelLinkChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    const updatedReel = { completed: reel.completed, link: stringValue };
    onUpdate({ reel: updatedReel, story });
  };

  const handleStoryLinkChange = (value: string | number) => {
    const stringValue = typeof value === 'string' ? value : value.toString();
    const updatedStory = { completed: story.completed, link: stringValue };
    onUpdate({ reel, story: updatedStory });
  };

  const bothCompleted = reel.completed && story.completed;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="reel-completed" className="activity-label text-sm font-medium text-foreground">Reel posted</Label>
          <Switch
            id="reel-completed"
            checked={reel.completed}
            onCheckedChange={handleReelToggle}
          />
        </div>
        
        <EditableField
          label="Reel link (optional)"
          value={reel.link || ""}
          type="text"
          placeholder="Paste reel link..."
          onSave={handleReelLinkChange}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="story-completed" className="activity-label text-sm font-medium text-foreground">Story posted</Label>
          <Switch
            id="story-completed"
            checked={story.completed}
            onCheckedChange={handleStoryToggle}
          />
        </div>
        
        <EditableField
          label="Story link (optional)"
          value={story.link || ""}
          type="text"
          placeholder="Paste story link..."
          onSave={handleStoryLinkChange}
        />
      </div>

      <div className={`activity-description text-xs font-medium ${bothCompleted ? 'text-green-600' : 'text-orange-600'}`}>
        {bothCompleted 
          ? '✅ Both posts completed - full point earned!' 
          : 'Complete both reel and story to earn the point'
        }
      </div>
    </div>
  );
};