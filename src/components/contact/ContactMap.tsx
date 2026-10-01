interface ContactMapProps {
  mapQuery: string;
  title: string;
  openInMapsLabel: string;
}

export function ContactMap({ mapQuery, title, openInMapsLabel }: ContactMapProps) {
  const query = encodeURIComponent(mapQuery);
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
      <iframe
        title={title}
        src={embedSrc}
        className="h-56 w-full border-0 sm:h-64"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <p className="border-t border-gray-100 bg-white px-4 py-2 text-center text-sm">
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {openInMapsLabel}
        </a>
      </p>
    </div>
  );
}
