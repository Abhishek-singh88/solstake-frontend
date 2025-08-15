import { SolanaProvider } from '../components/SolanaProvider';

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SolanaProvider>
      {children}
    </SolanaProvider>
  );
}
