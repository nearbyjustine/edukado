import dynamic from "next/dynamic";
import { Loader2, LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface IconProps extends LucideProps {
  name: keyof typeof dynamicIconImports;
}

const SidebarIcon = ({ name, ...props }: IconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name], {
    loading: () => <Loader2 className='animate-spin' />,
  });

  return <LucideIcon {...props} />;
};

export default SidebarIcon;
