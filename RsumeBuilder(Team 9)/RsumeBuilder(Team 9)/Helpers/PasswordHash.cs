﻿using System.Security.Cryptography;

namespace RsumeBuilder_Team_9_.Helpers
{
    public class PasswordHash
    {
        private static readonly int SaltSize = 16;
        private static readonly int HashSize = 20;
        private static readonly int Iterations = 10000;

        public static string HashPassword(string password)
        {
            byte[] salt = new byte[SaltSize];
            RandomNumberGenerator.Fill(salt);
            var key = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            
            byte[] hash = key.GetBytes(HashSize);

            // Combine the salt and hash into a single byte array
            byte[] hashBytes = new byte[SaltSize + HashSize];
            Array.Copy(salt, 0, hashBytes, 0, SaltSize);
            Array.Copy(hash, 0, hashBytes, SaltSize, HashSize);

            // Convert to Base64 for storage
            var base64Hash = Convert.ToBase64String(hashBytes);
                
            return base64Hash;
            
        }

        public static bool VerifyPass(string password, string base64Hash)
        {
            var hashBytes = Convert.FromBase64String(base64Hash);

            var salt = new byte[SaltSize];
            Array.Copy(hashBytes, 0, salt, 0, SaltSize);

            var key = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            byte[] hash = key.GetBytes(HashSize);

            for (var i = 0; i < HashSize; i++)
            {
                if(hashBytes[i + SaltSize] != hash[i])
                    return false;
            }

            return true;
        }
    }
}
