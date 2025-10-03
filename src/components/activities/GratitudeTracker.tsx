import { useState, useEffect } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Plus, X } from 'lucide-react';

interface GratitudeTrackerProps {
  people: string[];
  onUpdate: (people: string[]) => void;
}

export const GratitudeTracker = ({ people, onUpdate }: GratitudeTrackerProps) => {
  const [newPerson, setNewPerson] = useState('');
  const [gratitudePeople, setGratitudePeople] = useState(people);

  useEffect(() => {
    setGratitudePeople(people);
  }, [people]);

  const addPerson = () => {
    if (newPerson.trim() && !gratitudePeople.includes(newPerson.trim())) {
      const updatedPeople = [...gratitudePeople, newPerson.trim()];
      setGratitudePeople(updatedPeople);
      onUpdate(updatedPeople);
      setNewPerson('');
    }
  };

  const removePerson = (person: string) => {
    const updatedPeople = gratitudePeople.filter(p => p !== person);
    setGratitudePeople(updatedPeople);
    onUpdate(updatedPeople);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Label className="activity-label text-sm font-medium text-foreground">Text gratitude to 2 people</Label>
        
        {gratitudePeople.length > 0 && (
          <div className="space-y-2">
            <Label className="activity-label text-xs font-medium text-muted-foreground uppercase tracking-wide">People texted:</Label>
            <div className="flex flex-wrap gap-2">
              {gratitudePeople.map((person) => (
                <Badge key={person} variant="secondary" className="flex items-center gap-1">
                  {person}
                  <button
                    onClick={() => removePerson(person)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Add person's name..."
            value={newPerson}
            onChange={(e) => setNewPerson(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPerson()}
          />
          <Button onClick={addPerson} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`activity-description text-xs font-medium ${gratitudePeople.length >= 2 ? 'text-green-600' : 'text-orange-600'}`}>
        Progress: {gratitudePeople.length}/2 people texted
        {gratitudePeople.length >= 2 && ' ✅ Target achieved!'}
      </div>
    </div>
  );
};