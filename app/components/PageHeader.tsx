import Link from 'next/link';

interface NavButton {
  href: string;
  label: string;
  icon?: React.ReactNode;
  colorClass?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  navButtons?: NavButton[];
  gradientClass?: string;
}

export default function PageHeader({ 
  title, 
  description, 
  navButtons = [],
  gradientClass = 'from-blue-50 to-white dark:from-gray-800 dark:to-gray-900'
}: PageHeaderProps) {
  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r ${gradientClass} p-6 rounded-xl shadow-sm mb-8`}>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {navButtons.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          {navButtons.map((button, index) => (
            <Link key={index} href={button.href}>
              <button className={`${button.colorClass || 'btn-primary'} flex items-center gap-2`}>
                {button.icon}
                {button.label}
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 