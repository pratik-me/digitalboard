
const Participants = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md">
      List of Users
    </div>
  );
};

export default Participants

Participants.Skeleton = function() {
    return (
        <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-2 flex items-center shadow-md w-25" />
    )
} 