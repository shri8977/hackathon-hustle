interface ToolHeaderProps {
  title: string;
  description: string;
}

const ToolHeader = ({ title, description }: ToolHeaderProps) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
    <p className="text-sm text-muted-foreground mt-2 max-w-lg">{description}</p>
  </div>
);

export default ToolHeader;
