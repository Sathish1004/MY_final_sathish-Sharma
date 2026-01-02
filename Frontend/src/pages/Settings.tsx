export default function Settings() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Settings</h1>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-slate-600 mb-6">Manage your account settings and preferences.</p>

                <div className="space-y-6">
                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-slate-900">Change Password</h3>
                            <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                            Update
                        </button>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-medium text-slate-900">Email Notifications</h3>
                            <p className="text-sm text-slate-500">Manage what emails you receive from us.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200">
                            Manage
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
