import Image from "next/image"
import home from '../../public/Sign-up.png';

export default function Layout({ children }) {
    return (
        <main className="h-[100vh] flex flex-col">
            <div className="px-20 py-10">
                <p className="text-[#FF748C] font-bold text-4xl">TweetX</p>
            </div>
            <div className="flex">
                {children}
                <div className="fixed top-0 bottom-0 right-0 w-[55%] h-[100%] object-contain">
                    <Image src={home} alt="home" layout="fill" />
                </div>
            </div>
        </main>
    )
}
