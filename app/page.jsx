import LandingPageClient from "@/app/ui/landingPageClient";

export const metadata = {
    title: {
        default: "GamMap",
        template: "%s | GamMap",
    },
    description: "Application de planification de trajets",
};

export default function Page() {
    return <LandingPageClient />;
}