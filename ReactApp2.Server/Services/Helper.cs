namespace ReactApp2.Server {
    public class Helper {
        Random random = new Random();
        public string GenerateImageName(string fileNameWithExtension) {
            return Guid.NewGuid().ToString() + random.Next(0,10000) + fileNameWithExtension;
        }
    }
}