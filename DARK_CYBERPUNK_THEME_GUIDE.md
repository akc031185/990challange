# 90-Day Challenge: Complete Claude VS Code Bundle

## 🎯 **PROJECT CONTEXT**

I'm working on a **90-Day Challenge app** for iOS that tracks 9 daily activities (calories, workout, sleep, supplements, habits, LOI, gratitude, connections, posts) with a scoring system where completing all 9 activities earns a bonus point for weekly averages.

**Key Features:**
- Team collaboration with leaderboards
- Local authentication (demo mode)
- Apple Health integration setup
- Persistent user settings for calorie targets, supplements, and habits
- React/TypeScript + Capacitor for native iOS deployment
- Onboarding flow + profile settings for team management
- Daily progress as X/9, weekly averages show X/10 (bonus points)
- Social sharing feature (1080x1080px progress images)
- **Dark cyberpunk theme** with navy backgrounds and bright cyan accents

## 🎨 **DARK CYBERPUNK THEME - MANDATORY COLORS**

**ALWAYS use these EXACT HSL values when creating/modifying components:**

### **Core Color Palette:**
```css
--background: hsl(222, 47%, 11%);         /* Dark navy background */
--foreground: hsl(180, 100%, 80%);        /* Bright cyan text */
--card: hsl(222, 47%, 15%);               /* Slightly lighter navy cards */
--card-foreground: hsl(180, 100%, 85%);   /* Bright cyan card text */
--primary: hsl(195, 100%, 60%);           /* Vibrant cyan (buttons, links) */
--primary-foreground: hsl(222, 47%, 15%); /* Dark text on cyan */
--secondary: hsl(280, 85%, 70%);          /* Bright purple (accents) */
--muted: hsl(222, 30%, 35%);              /* Lighter dark areas */
--muted-foreground: hsl(180, 60%, 65%);   /* Subdued cyan text */
--border: hsl(222, 30%, 30%);             /* Visible dark borders */
--input: hsl(222, 30%, 20%);              /* Dark input backgrounds */

/* Switch Colors - CRITICAL for proper toggle styling */
--switch-background: hsl(222, 30%, 25%);           /* OFF state */
--switch-background-checked: hsl(195, 100%, 70%);  /* ON state - glows cyan */
--switch-thumb: hsl(0, 0%, 95%);                   /* Light thumb OFF */
--switch-thumb-checked: hsl(222, 47%, 12%);        /* Dark thumb ON */
```

### **Tailwind Class Patterns:**
```tsx
// Cards - ALWAYS neutral, never change color
<Card className="bg-card border-border text-card-foreground">

// Headings
<h1 className="text-foreground font-semibold">Main Title</h1>
<h2 className="text-primary font-bold">Section Header</h2>

// Labels & Meta Text
<Label className="text-muted-foreground text-xs uppercase tracking-wide">Field Label</Label>
<p className="text-muted-foreground text-xs">Description text</p>

// Interactive Elements
<Button className="bg-primary text-primary-foreground hover:opacity-90">Action</Button>
<Input className="bg-input border-border text-foreground">
```

## 🛠️ **COMPONENT STYLING RULES**

### **✅ DO:**
- Use consistent HSL color values from the palette above
- Keep cards neutral (`bg-card`) - **NEVER change card backgrounds**
- Make switches glow cyan when active (see CSS below)
- Use proper text hierarchy (`foreground` > `muted-foreground`)
- Add smooth transitions (`transition-all duration-200`)

### **❌ DON'T:**
- Change card colors based on completion state
- Use green/red success/error colors (stick to theme)
- Override cyan/navy color scheme
- Make switches invisible or low contrast

### **Switch Component CSS (Required):**
```css
/* Ensure switches work properly in dark theme */
button[role="switch"], [data-slot="switch"] {
  background-color: var(--switch-background) !important;
  border: 2px solid var(--border) !important;
}

button[role="switch"][data-state="checked"],
[data-slot="switch"][data-state="checked"] {
  background-color: var(--switch-background-checked) !important;
  border-color: var(--switch-background-checked) !important;
  box-shadow: 0 0 16px hsla(195, 100%, 70%, 0.5) !important;
}

/* Force cards to stay consistent */
.card, [data-slot="card"] {
  background-color: var(--card) !important;
  color: var(--card-foreground) !important;
}
```

## 📁 **CURRENT PROJECT STRUCTURE**

```
90-Day Challenge App/
├── App.tsx                    # Main app component
├── styles/globals.css         # Dark theme CSS variables
├── components/
│   ├── DailyTracker.tsx      # Main activity tracking
│   ├── ProgressOverview.tsx  # Progress display
│   ├── ShareProgress.tsx     # Social sharing
│   ├── activities/           # Individual activity trackers
│   │   ├── CalorieTracker.tsx
│   │   ├── WorkoutTracker.tsx
│   │   ├── HabitTracker.tsx
│   │   └── ... (6 more)
│   ├── auth/                 # Authentication
│   ├── onboarding/          # User onboarding
│   ├── profile/             # Settings & profile
│   ├── team/                # Team management
│   └── ui/                  # shadcn/ui components
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript definitions
```

## 🎯 **KEY ARCHITECTURE NOTES**

### **Authentication:**
- Demo mode with local storage
- `useAuth` hook manages user state
- Automatic onboarding for new users

### **Activity Tracking:**
- 9 core activities tracked daily
- Each has completion toggle + optional inputs
- Bonus point system for completing all 9

### **Team Features:**
- Join/create teams with codes
- Leaderboard competition
- Team management in profile

### **Styling System:**
- Tailwind v4 with custom CSS variables
- shadcn/ui components with dark theme
- Mobile-first responsive design
- iOS safe area handling

## 📱 **COMPONENT CREATION GUIDELINES**

### **When creating NEW components:**

1. **Import pattern:**
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
```

2. **Layout pattern:**
```tsx
export const MyComponent = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Title</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-sm">Label</Label>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};
```

3. **State management:**
- Use local state for UI interactions
- Use custom hooks for data persistence
- Follow existing patterns in `/hooks` directory

### **When MODIFYING existing components:**

1. **Preserve existing structure** and class names
2. **Don't change card backgrounds** - keep `bg-card`
3. **Maintain switch styling** - they should glow cyan when active
4. **Follow established patterns** from other components

## 🚀 **COMMON TASKS & EXAMPLES**

### **Add new activity tracker:**
```tsx
// Follow pattern from existing activities like HabitTracker.tsx
interface NewTrackerProps {
  value: string | number;
  completed: boolean;
  onValueUpdate: (value: string | number) => void;
  onCompletedUpdate: (completed: boolean) => void;
}

export const NewTracker = ({ value, completed, onValueUpdate, onCompletedUpdate }: NewTrackerProps) => {
  return (
    <div className="space-y-4">
      {/* Input field if needed */}
      <div className="flex items-center justify-between">
        <Label className="text-muted-foreground text-sm">Activity completed</Label>
        <Switch
          checked={completed}
          onCheckedChange={onCompletedUpdate}
        />
      </div>
      <p className="text-muted-foreground text-xs">
        {completed ? "✅ Great job!" : "Toggle when complete"}
      </p>
    </div>
  );
};
```

### **Create progress card:**
```tsx
<Card className="bg-card border-border">
  <CardContent className="p-4 text-center">
    <p className="text-muted-foreground text-xs mb-1">Today's Progress</p>
    <p className="text-foreground text-2xl font-bold">7/9</p>
    <p className="text-muted-foreground text-xs">Activities Complete</p>
  </CardContent>
</Card>
```

### **Add settings toggle:**
```tsx
<div className="flex items-center justify-between p-4 bg-card rounded-lg">
  <div>
    <Label className="text-foreground text-sm">Setting Name</Label>
    <p className="text-muted-foreground text-xs">Description</p>
  </div>
  <Switch />
</div>
```

## 🎨 **VISUAL CONSISTENCY CHECKLIST**

Before submitting any code, verify:

- [ ] Cards use `bg-card` (dark navy)
- [ ] Text uses `text-foreground` or `text-muted-foreground`
- [ ] Switches glow cyan when checked
- [ ] Buttons use `bg-primary` (bright cyan)
- [ ] Labels use `text-muted-foreground text-xs`
- [ ] Proper spacing with `space-y-4` or similar
- [ ] Border colors use `border-border`
- [ ] No light theme colors anywhere

## 🔧 **DEBUGGING THEME ISSUES**

If components appear with light backgrounds:

1. **Check CSS specificity** - add `!important` if needed
2. **Verify class names** match the patterns above
3. **Ensure no conditional styling** changes card colors
4. **Test switch states** - they should glow, not change card color

## 📋 **EXAMPLE PROMPT FOR CLAUDE**

Use this format when asking Claude to work on components:

```
I'm working on my 90-Day Challenge app with a dark cyberpunk theme. Please [create/modify] [component name] following these requirements:

[Specific functional requirements]

**Theme Requirements:**
- Use dark cyberpunk colors from the bundle guide
- Cards: bg-card (dark navy, never changes color)
- Switches: glow cyan when checked, no card color changes
- Text: text-foreground for headings, text-muted-foreground for labels
- Follow the component patterns from the bundle

[Copy relevant sections from this bundle as needed]
```

## 🎯 **CURRENT STATE SUMMARY**

✅ **Completed:**
- Dark cyberpunk theme implementation
- 9 activity trackers with proper switch styling
- Authentication & onboarding flow
- Team management & leaderboard
- Progress tracking & social sharing
- Mobile optimizations & iOS setup

🔧 **Recently Fixed:**
- Card backgrounds stay consistently dark
- Switches glow bright cyan when active
- No light theme interference
- Proper CSS priority with !important declarations

🚀 **Ready for:**
- Feature additions following established patterns
- UI refinements maintaining theme consistency
- iOS deployment and App Store submission
