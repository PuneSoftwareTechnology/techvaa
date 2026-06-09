import {
  Award,
  MonitorPlay,
  CalendarClock,
  Briefcase,
  GraduationCap,
  FileText,
  Mic,
  Users,
  ShieldCheck,
  Server,
  Headphones,
  BookOpen,
  Search,
  type LucideIcon,
} from "lucide-react";

/** Maps the string icon keys used in constants to lucide components. */
const ICONS: Record<string, LucideIcon> = {
  award: Award,
  "monitor-play": MonitorPlay,
  "calendar-clock": CalendarClock,
  briefcase: Briefcase,
  "graduation-cap": GraduationCap,
  "file-text": FileText,
  mic: Mic,
  users: Users,
  "shield-check": ShieldCheck,
  server: Server,
  headphones: Headphones,
  "book-open": BookOpen,
  search: Search,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? Award;
  return <Icon className={className} aria-hidden="true" />;
}
