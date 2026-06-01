import { Mail, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const VerifyFirst = () => {
    return (
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">

            {/* Background Glow */}
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-orange-500/10 blur-[140px]" />
            </div>

            {/* Grid Texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)
          `,
                    backgroundSize: '28px 28px',
                }}
            />

            <div className="relative z-10 w-full max-w-xl">

                <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] backdrop-blur-xl">

                    {/* Accent Line */}
                    <div className="h-[3px] bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500" />

                    <div className="p-10">

                        {/* Icon */}
                        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border border-orange-500/20 bg-orange-500/10">
                            <ShieldCheck className="h-10 w-10 text-orange-400" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-center text-4xl font-black tracking-tight text-white">
                            Verify Your Email First
                        </h1>

                        <p className="mx-auto mt-5 max-w-md text-center text-zinc-400 leading-relaxed">
                            Before accessing your dashboard, please verify your
                            email address. We've sent a verification link to
                            your inbox.
                        </p>

                        {/* Info Box */}
                        <div className="mt-8 rounded-2xl border border-orange-500/10 bg-orange-500/5 p-5">
                            <div className="flex items-start gap-4">
                                <Mail className="mt-0.5 h-5 w-5 text-orange-400" />

                                <div>
                                    <h3 className="font-semibold text-white">
                                        Check your inbox
                                    </h3>

                                    <p className="mt-1 text-sm text-zinc-500">
                                        Open the verification email and click
                                        the verification button to activate your
                                        account.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="mt-6 rounded-2xl border border-white/5 bg-black/20 p-5">
                            <p className="text-sm text-zinc-500">
                                Can't find the email?
                            </p>

                            <ul className="mt-3 space-y-2 text-sm text-zinc-400">
                                <li>• Check your Spam folder</li>
                                <li>• Check Promotions tab (Gmail)</li>
                                <li>• Wait 1–2 minutes and refresh</li>
                                <li>• Request a new verification email</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                            <button
                                className="
                  flex-1 rounded-xl
                  bg-gradient-to-r
                  from-orange-500
                  to-amber-500
                  px-5 py-3
                  font-medium
                  text-white
                  transition-all
                  duration-300
                  hover:scale-[1.02]
                "
                            >
                                Resend Verification Email
                            </button>

                            <Link
                                to="/login"
                                className="
                  flex items-center justify-center gap-2
                  rounded-xl border border-white/10
                  px-5 py-3
                  text-zinc-300
                  transition-all duration-300
                  hover:bg-white/5
                "
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VerifyFirst