import { useSettingsStore, useThemeStore } from "@/store";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Slider } from "@/components/ui/Slider";
import { Badge } from "@/components/ui/Badge";
import {
  AudioLines,
  Eye,
  Monitor,
  Volume2,
  Keyboard,
  Bell,
  Users,
  SkipForward,
  Play,
  Languages,
  Sun,
} from "lucide-react";

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  icon: Icon,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  onToggle: () => void;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-white/5">
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-text-subdued" />
        <div>
          <p className="text-sm text-white">{label}</p>
          {description && <p className="text-xs text-text-subdued">{description}</p>}
        </div>
      </div>
      <button
        onClick={onToggle}
        aria-label={`Toggle ${label}`}
        className={`relative h-6 w-10 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
          enabled ? "bg-accent" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            enabled ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="overflow-hidden" padding="none">
      <div className="border-b border-white/5 px-4 py-3">
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </Card>
  );
}

export function SettingsPage() {
  const settings = useSettingsStore();
  const theme = useThemeStore();

  const audioQualities = ["low", "normal", "high", "lossless"] as const;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-3xl font-bold text-white">Settings</h1>

      <div className="space-y-6">
        {/* Playback */}
        <SectionCard title="Playback">
          <ToggleRow
            label="Gapless Playback"
            description="Seamless transition between tracks"
            enabled={settings.gaplessPlayback}
            onToggle={settings.toggleGaplessPlayback}
            icon={SkipForward}
          />
          <ToggleRow
            label="Auto-play"
            description="Automatically play similar songs when your music ends"
            enabled={settings.autoPlay}
            onToggle={settings.toggleAutoPlay}
            icon={Play}
          />
          <div className="flex items-center gap-4 px-4 py-3">
            <Volume2 size={18} className="shrink-0 text-text-subdued" />
            <div className="flex-1">
              <p className="text-sm text-white">Playback Speed</p>
              <p className="text-xs text-text-subdued">{settings.playbackSpeed}x</p>
            </div>
            <Slider
              value={settings.playbackSpeed}
              min={0.25}
              max={4}
              step={0.25}
              onChange={settings.setPlaybackSpeed}
              size="sm"
              className="w-32"
              ariaLabel="Playback speed"
            />
          </div>
          <div className="flex items-center gap-4 px-4 py-3">
            <AudioLines size={18} className="shrink-0 text-text-subdued" />
            <div className="flex-1">
              <p className="text-sm text-white">Audio Quality</p>
            </div>
            <div className="flex gap-1">
              {audioQualities.map((q) => (
                <Button
                  key={q}
                  variant={settings.audioQuality === q ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => settings.setAudioQuality(q)}
                >
                  {q.charAt(0).toUpperCase() + q.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Display */}
        <SectionCard title="Display">
          <div className="flex items-center gap-4 px-4 py-3">
            <Sun size={18} className="shrink-0 text-text-subdued" />
            <div className="flex-1">
              <p className="text-sm text-white">Theme</p>
            </div>
            <div className="flex gap-1">
              {(["dark", "light", "system"] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={theme.mode === mode ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => theme.setMode(mode)}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <ToggleRow
            label="Compact Mode"
            description="Reduce spacing and element sizes"
            enabled={theme.compactMode}
            onToggle={() => theme.setCompactMode(!theme.compactMode)}
            icon={Monitor}
          />
          <ToggleRow
            label="Reduced Motion"
            description="Minimize animations and transitions"
            enabled={theme.reducedMotion}
            onToggle={() => theme.setReducedMotion(!theme.reducedMotion)}
            icon={Eye}
          />
          <div className="flex items-center gap-4 px-4 py-3">
            <Languages size={18} className="shrink-0 text-text-subdued" />
            <div className="flex-1">
              <p className="text-sm text-white">Language</p>
              <p className="text-xs text-text-subdued">{settings.language}</p>
            </div>
            <Badge>Coming soon</Badge>
          </div>
        </SectionCard>

        {/* Features */}
        <SectionCard title="Features">
          <ToggleRow
            label="Show Lyrics"
            description="Display synced lyrics when available"
            enabled={settings.showLyrics}
            onToggle={settings.toggleLyrics}
            icon={AudioLines}
          />
          <ToggleRow
            label="Show Visualizer"
            description="Animated visual effects during playback"
            enabled={settings.showVisualizer}
            onToggle={settings.toggleVisualizer}
            icon={Eye}
          />
          <ToggleRow
            label="Keyboard Shortcuts"
            description="Space, arrows, and other hotkeys"
            enabled={settings.keyboardShortcuts}
            onToggle={settings.toggleKeyboardShortcuts}
            icon={Keyboard}
          />
          <ToggleRow
            label="Notifications"
            description="Show toast notifications"
            enabled={settings.notificationsEnabled}
            onToggle={settings.toggleNotifications}
            icon={Bell}
          />
          <ToggleRow
            label="Social Features"
            description="Follow artists and share playlists"
            enabled={settings.socialFeatures}
            onToggle={settings.toggleSocialFeatures}
            icon={Users}
          />
        </SectionCard>
      </div>
    </div>
  );
}
