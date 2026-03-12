import { Button, clsx, IconButton } from '@hanlogy/react-web-ui';
import { DeleteSvg } from '../svgs';

export interface Link {
  id: string;
  title: string;
  url: string;
}

export function LinksSection({
  links: defaultLinks,
  onChange,
}: {
  links: Link[];
  onChange: (values: Link[]) => void;
}) {
  const handleOnChange = (
    id: string,
    field: 'url' | 'title',
    value: string
  ) => {
    return links.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value,
        };
      }
      return item;
    });
  };

  const handleAdd = () => {
    return [...links, { id: crypto.randomUUID(), url: '', title: '' }];
  };

  const handleDelete = (id: string) => {
    onChange(links.filter((e) => e.id != id));
  };

  const links = defaultLinks.length
    ? defaultLinks
    : [
        {
          id: crypto.randomUUID(),
          title: '',
          url: '',
        },
      ];

  return (
    <>
      <div className="space-y-4">
        {links.map(({ id, title, url }) => {
          return (
            <div key={id} className="flex items-end">
              <div className="border-border bg-surface-secondary flex flex-1 flex-col rounded-lg border">
                <Input
                  onChange={(v) => handleOnChange(id, 'title', v)}
                  defaultValue={title}
                  label="Title"
                  type="text"
                  className="border-b-border border-b"
                />
                <Input
                  onChange={(v) => handleOnChange(id, 'url', v)}
                  defaultValue={url}
                  label="Url"
                  type="url"
                />
              </div>
              {links.length > 1 && (
                <IconButton
                  onClick={() => {
                    handleDelete(id);
                  }}
                  size="xsmall"
                  className="text-foreground-muted"
                >
                  <DeleteSvg className="w-5" />
                </IconButton>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <Button
          onClick={() => handleAdd()}
          className="border-border text-foreground-secondary hover:bg-surface-secondary border"
          size="xsmall"
        >
          Add one more link
        </Button>
      </div>
    </>
  );
}

function Input({
  label,
  type,
  defaultValue,
  className,
  onChange,
}: {
  label: string;
  type: 'text' | 'url';
  defaultValue: string;
  className?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className={clsx(className)}>
      <div className="text-foreground-muted px-4 pt-2 text-sm font-semibold">
        {label}
      </div>
      <input
        onChange={(e) => onChange(e.currentTarget.value)}
        defaultValue={defaultValue}
        type={type}
        className="border-b-border h-8 w-full px-4 focus:border-transparent focus:ring-0 focus:outline-none"
      />
    </label>
  );
}
