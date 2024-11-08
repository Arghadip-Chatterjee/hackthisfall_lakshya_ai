import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

export const UserAvatar = () => {
  // Replace with a placeholder image or initials
  const placeholderImageUrl = "path/to/placeholder.png"; // Or generate initials

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={placeholderImageUrl} />
      <AvatarFallback>
        {/* Replace with initials generation logic if needed */}
        <span>?</span>
      </AvatarFallback>
    </Avatar>
  );
};
