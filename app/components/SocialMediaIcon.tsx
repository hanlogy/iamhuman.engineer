import { isEmail } from '@/helpers/isEmail';
import type { IconType } from 'react-icons';
import {
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaTelegram,
  FaThreads,
  FaTiktok,
  FaTwitch,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
import { SiDevdotto } from 'react-icons/si';

type SocialPlatform =
  | 'email'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'x'
  | 'tiktok'
  | 'threads'
  | 'reddit'
  | 'snapchat'
  | 'pinterest'
  | 'medium'
  | 'devto'
  | 'discord'
  | 'telegram'
  | 'twitch'
  | 'website';

interface SocialMediaIconProps {
  url: string;
  size?: number;
  className?: string;
}

const PLATFORM_ICONS: Record<SocialPlatform, IconType> = {
  email: FaEnvelope,
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  github: FaGithub,
  youtube: FaYoutube,
  x: FaXTwitter,
  tiktok: FaTiktok,
  threads: FaThreads,
  reddit: FaReddit,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  medium: FaMedium,
  devto: SiDevdotto,
  discord: FaDiscord,
  telegram: FaTelegram,
  twitch: FaTwitch,
  website: FaGlobe,
};


function normalizeUrl(url: string): string {
  const value = url.trim();

  if (value.length === 0) {
    return '';
  }

  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  return `https://${value}`;
}

function getHostname(url: string): string | null {
  const normalizedUrl = normalizeUrl(url);

  if (normalizedUrl.length === 0) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalizedUrl);
    return parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
}

function normalizeHostname(hostname: string): string {
  return hostname.replace(/^(www\.|m\.|mobile\.)/, '');
}

function matchPlatform(hostname: string): SocialPlatform {
  if (hostname === 'facebook.com' || hostname.endsWith('.facebook.com')) {
    return 'facebook';
  }

  if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
    return 'instagram';
  }

  if (hostname === 'linkedin.com' || hostname.endsWith('.linkedin.com')) {
    return 'linkedin';
  }

  if (hostname === 'github.com' || hostname.endsWith('.github.com')) {
    return 'github';
  }

  if (
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtu.be'
  ) {
    return 'youtube';
  }

  if (
    hostname === 'x.com' ||
    hostname.endsWith('.x.com') ||
    hostname === 'twitter.com' ||
    hostname.endsWith('.twitter.com')
  ) {
    return 'x';
  }

  if (hostname === 'tiktok.com' || hostname.endsWith('.tiktok.com')) {
    return 'tiktok';
  }

  if (hostname === 'threads.net' || hostname.endsWith('.threads.net')) {
    return 'threads';
  }

  if (hostname === 'reddit.com' || hostname.endsWith('.reddit.com')) {
    return 'reddit';
  }

  if (hostname === 'snapchat.com' || hostname.endsWith('.snapchat.com')) {
    return 'snapchat';
  }

  if (hostname === 'pinterest.com' || hostname.endsWith('.pinterest.com')) {
    return 'pinterest';
  }

  if (hostname === 'medium.com' || hostname.endsWith('.medium.com')) {
    return 'medium';
  }

  if (hostname === 'dev.to') {
    return 'devto';
  }

  if (hostname === 'discord.gg' || hostname === 'discord.com') {
    return 'discord';
  }

  if (hostname === 't.me' || hostname === 'telegram.me') {
    return 'telegram';
  }

  if (hostname === 'twitch.tv' || hostname.endsWith('.twitch.tv')) {
    return 'twitch';
  }

  return 'website';
}

export function detectSocialMediaPlatform(url: string): SocialPlatform {
  if (isEmail(url)) {
    return 'email';
  }

  const hostname = getHostname(url);

  if (!hostname) {
    return 'website';
  }

  return matchPlatform(normalizeHostname(hostname));
}

export function SocialMediaIcon({
  url,
  size = 18,
  className,
}: SocialMediaIconProps) {
  const platform = detectSocialMediaPlatform(url);
  const Icon = PLATFORM_ICONS[platform];

  return <Icon size={size} className={className} aria-hidden="true" />;
}
