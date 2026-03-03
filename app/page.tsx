import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-20 px-4 text-center">
      <Image
        className="w-30 opacity-80"
        src="/logo.svg"
        alt="IAmHuman logo"
        width={100}
        height={100}
        priority
      />
      <h1 className="mt-10 text-2xl font-semibold">IAmHuman.Engineer</h1>
      <p className="mt-2 text-lg">
        It&apos;s absurd we have to prove we exist.
      </p>
      <p className="italic mt-6">Coming soon...</p>
      <a href="https://github.com/hanlogy/iamhuman.engineer" target="_blank">
        <Image
          className="w-6 opacity-80 mt-2"
          src="/github-logo-black.svg"
          alt="GitHub logo"
          width={24}
          height={24}
          priority
        />
      </a>
    </div>
  );
}
