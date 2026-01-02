import { quickLinks } from '@/config/quickLinks';
import { SmartLink } from '@/components/common/SmartLink';

export function DashboardFooter() {
    return (
        <div className="mt-8 border-t border-slate-200 pt-6 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center md:justify-start">
                    {quickLinks.map((link) => (
                        <SmartLink
                            key={link.id}
                            link={link}
                            variant="simple"
                            className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors"
                        />
                    ))}
                </div>
                <div className="text-xs text-slate-400">
                    &copy; 2025 Prolync Infotech.in Pvt Ltd.
                </div>
            </div>
        </div>
    );
}
