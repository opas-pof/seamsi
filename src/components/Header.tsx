import { Link } from "react-router-dom";

const Header = () => {
	return (
		<header className="w-full bg-[#3ec9b0] text-white">
			<div className="container mx-auto px-4">
				<div className="h-14 flex items-center gap-4">
					<Link to="/" className="inline-flex items-center">
						<img
							src="https://my.kapook.com/img-portal/logo-kapook.png"
							alt="Kapook"
							className="h-8 w-auto"
						/>
					</Link>
				</div>
			</div>
		</header>
	);
};

export default Header;


