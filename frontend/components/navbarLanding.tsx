import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/navbar.module.css";


const NavbarLanding = () => {
    return (
        <nav className="bg-black w-[100%] h-24 grid grid-cols-2 items-center px-6 md:px-12 lg:px-24 sticky top-0 z-50">
            <div className="">
                <Link className="lg:w-72 lg:h-24 md:w-48 md:h-16 w-48 h-16 flex" href="/">
                    <Image
                        className="lg:w-72 lg:h-24 md:w-48 md:h-16 w-48 h-16 md:p-1 lg:p-2"
                        src="/logoSmall.png"
                        alt="logo"
                        width={1080}
                        height={1}
                    />
                </Link>
            </div>
            <div className="flex justify-end gap-2 h-full">
                <Link href="/Login">
                    <button className={styles.btn}>Existing User</button>
                </Link>
                <Link href="/Signup">
                    <button className={styles.btn}>New User</button>
                </Link>
            </div>
        </nav>
    );
};
export default NavbarLanding;
