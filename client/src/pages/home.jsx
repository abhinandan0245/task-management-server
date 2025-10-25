import { Link } from "react-router-dom";
import homepagedark from "../../images/homepage.png";
import homepagelight from "../../images/homepage2.png";
import homepagemobilelight from "../../images/homepagemobilelight.png";
import homepagemobiledark from "../../images/homepagemobiledark.png";
import { Container } from "../components/ui/container";
import { buttonVariants } from "../components/ui/button";

export const Home = () => {
  return (
    <main className="h-full overflow-y-auto">
      <section className="pb-10 pt-28">
        <Container>
          <h1 className="mb-4 text-4xl font-bold leading-normal text-center">
            Streamline Your Tasks with Task Management
          </h1>
          <p className="mb-12 text-base font-medium leading-normal text-center dark:font-normal">
            Discover a smarter way to manage your tasks with Task Management.
            Organize, prioritize, and achieve more with intuitive features
            designed to boost productivity. Whether you're tackling personal
            projects or team assignments, Task Management is your ultimate task
            management solution.
          </p>
          <div className="flex items-center gap-2 mx-auto w-max">
            <Link to="/tasks/" className={buttonVariants("outline")}>
              Dashboard
            </Link>
            <Link to="/sign-up/" className={buttonVariants()}>
              Get Started
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-10">
        <Container>
          <div className="relative w-full overflow-hidden border rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800">
            {/* Desktop Images */}
            <div className="hidden md:block">
              {/* Light mode */}
              <img
                src={homepagelight}
                alt="Task Management Light Preview"
                className="w-full h-auto md:h-[80vh] lg:h-[92vh] object-contain rounded-xl dark:hidden"
              />
              {/* Dark mode */}
              <img
                src={homepagedark}
                alt="Task Management Dark Preview"
                className="w-full h-auto md:h-[80vh] lg:h-[92vh] object-contain rounded-xl hidden dark:block"
              />
            </div>

            {/* Mobile Images */}
            <div className="block md:hidden">
              {/* Light mode */}
              <img
                src={homepagemobilelight}
                alt="Task Management Mobile Light Preview"
                className="object-contain w-full h-auto rounded-xl dark:hidden"
              />
              {/* Dark mode */}
              <img
                src={homepagemobiledark}
                alt="Task Management Mobile Dark Preview"
                className="hidden object-contain w-full h-auto rounded-xl dark:block"
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};
