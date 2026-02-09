import { FaGlobe, FaTwitter, FaInstagram, FaExternalLinkAlt } from 'react-icons/fa';

type SocialLinksProps = {
  website?: string | null;
  twitter?: string | null;
  instagram?: string | null;
  corich?: string | null;
  otherLinks?: string[];
  size?: 'sm' | 'md';
};

export default function SocialLinks({ website, twitter, instagram, corich, otherLinks, size = 'md' }: SocialLinksProps) {
  const iconSize = size === 'sm' ? 'text-sm' : 'text-base';
  const linkClass = `inline-flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'} text-gray-600 hover:text-pink-700 transition-colors`;

  const links: { href: string; icon: React.ReactNode; label: string }[] = [];

  if (website) links.push({ href: website, icon: <FaGlobe className={iconSize} />, label: 'Web' });
  if (twitter) links.push({ href: `https://x.com/${twitter}`, icon: <FaTwitter className={iconSize} />, label: `@${twitter}` });
  if (instagram) links.push({ href: `https://www.instagram.com/${instagram}/`, icon: <FaInstagram className={iconSize} />, label: `@${instagram}` });
  if (corich) links.push({ href: corich, icon: <FaExternalLinkAlt className={iconSize} />, label: 'CoRich' });
  if (otherLinks) {
    otherLinks.forEach((link, i) => {
      links.push({ href: link, icon: <FaExternalLinkAlt className={iconSize} />, label: 'Link' });
    });
  }

  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link, i) => (
        <a key={i} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {link.icon}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
}
