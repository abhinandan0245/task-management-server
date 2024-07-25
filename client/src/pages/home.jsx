import { Link } from "react-router-dom";

import { Container } from "../components/ui/container";
import { buttonVariants } from "../components/ui/button";

export const Home = () => {
  return (
    <main className="h-full overflow-y-auto">
      <section className="pt-28 pb-10">
        <Container>
          <h1 className="text-4xl leading-normal font-bold text-center mb-4">
            Streamline Your Tasks with Task Management
          </h1>
          <p className="text-base leading-normal font-medium dark:font-normal text-center mb-12">
            Discover a smarter way to manage your tasks with Task Management.
            Organize, prioritize, and achieve more with intuitive features
            designed to boost productivity. Whether you're tackling personal
            projects or team assignments, Task Management is your ultimate task
            management solution.
          </p>
          <div className="w-max mx-auto flex items-center gap-2">
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
          <div className="h-[82vh] w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800" />
        </Container>
      </section>
    </main>
  );
};
